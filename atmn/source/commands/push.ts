import {confirm} from '@inquirer/prompts';
import chalk from 'chalk';
import yoctoSpinner from 'yocto-spinner';
import type {Feature, Product} from '../compose/index.js';
import {FRONTEND_URL} from '../constants.js';
import {deleteFeature, deleteProduct} from '../core/api.js';
import {
	checkForDeletables,
	checkProductForConfirmation,
	upsertFeature,
	upsertProduct,
} from '../core/push.js';
import {initSpinner} from '../core/utils.js';
import {
	checkFeatureDeletionData,
	updateFeature,
} from '../core/requests/featureRequests.js';
import {
	getProductDeleteInfo,
	updateProduct,
} from '../core/requests/prodRequests.js';

const createSpinner = ({message}: {message?: string}) => {
	const spinner = yoctoSpinner({
		text: message ?? '',
	});
	spinner.start();

	return spinner;
};

const gatherProductDeletionDecisions = async ({
	productsToDelete,
}: {
	productsToDelete: string[];
}) => {
	const productDeletionDecisions = new Map<
		string,
		'delete' | 'archive' | 'skip'
	>();
	const batchCheckProducts = [];

	for (const productId of productsToDelete) {
		batchCheckProducts.push(getProductDeleteInfo({productId}));
	}

	const checkProductResults = await Promise.all(batchCheckProducts);

	for (let i = 0; i < productsToDelete.length; i++) {
		const productId = productsToDelete[i];
		const result = checkProductResults[i];

		if (!productId) continue;

		if (result && result.totalCount > 0) {
			const otherCustomersText =
				result.totalCount > 1
					? ` and ${result.totalCount - 1} other customer(s)`
					: '';
			const customerNameText = result.customerName || 'Unknown Customer';
			const shouldArchive = await confirm({
				message: `Product ${productId} has customer ${customerNameText}${otherCustomersText}. As such, you cannot delete it. Would you like to archive the product instead?`,
			});
			productDeletionDecisions.set(
				productId,
				shouldArchive ? 'archive' : 'skip',
			);
		} else {
			productDeletionDecisions.set(productId, 'delete');
		}
	}

	return productDeletionDecisions;
};

const handleProductDeletion = async ({
	productsToDelete,
	yes,
}: {
	productsToDelete: string[];
	yes: boolean;
}) => {
	const productDeletionDecisions = await gatherProductDeletionDecisions({
		productsToDelete,
	});

	for (const productId of productsToDelete) {
		const decision = productDeletionDecisions.get(productId);

		if (decision === 'delete') {
			const shouldDelete =
				yes ||
				(await confirm({
					message: `Delete product [${productId}]?`,
				}));

			if (shouldDelete) {
				const s = createSpinner({message: `Deleting product [${productId}]`});
				await deleteProduct({id: productId});
				s.success(`Product [${productId}] deleted successfully!`);
			}
		} else if (decision === 'archive') {
			const s = createSpinner({message: `Archiving product [${productId}]`});
			await updateProduct({productId, update: {archived: true}});
			s.success(`Product [${productId}] archived successfully!`);
		}
	}
};

const pushFeatures = async ({
	features,
	allFeatures,
}: {
	features: Feature[];
	allFeatures: Feature[];
}) => {
	// Handle archived features first (synchronously)

	for (const feature of features) {
		const isArchived = allFeatures.find(
			(f: Feature) => f.id === feature.id,
		)?.archived;

		if (isArchived) {
			const shouldUnarchive = await confirm({
				message: `Feature ${feature.id} is currently archived. Would you like to un-archive it before pushing?`,
			});
			if (shouldUnarchive) {
				const s = createSpinner({
					message: `Un-archiving feature [${feature.id}]`,
				});
				await updateFeature({id: feature.id, update: {archived: false}});

				s.success(`Feature [${feature.id}] un-archived successfully!`);
			}
		}
	}

	// Now push all features
	const batchFeatures = [];
	const s = initSpinner(`Pushing features`);
	for (const feature of features) {
		batchFeatures.push(upsertFeature(feature, s));
	}
	await Promise.all(batchFeatures);
	s.success(`Features pushed successfully!`);
	console.log(chalk.dim('\nFeatures pushed:'));
	features.forEach((feature: Feature) => {
		console.log(chalk.cyan(`  • ${feature.id}`));
	});
	console.log(); // Empty line for spacing
};

const gatherProductDecisions = async ({
	products,
	curProducts,
}: {
	products: Product[];
	curProducts: any[];
}) => {
	const productDecisions = new Map();
	const batchCheckProducts = [];

	for (const product of products) {
		batchCheckProducts.push(
			checkProductForConfirmation({
				curProducts,
				product,
			}),
		);
	}

	const checkProductResults = await Promise.all(batchCheckProducts);

	for (const result of checkProductResults) {
		if (result.archived) {
			const shouldUnarchive = await confirm({
				message: `Product ${result.id} is currently archived. Would you like to un-archive it before pushing?`,
			});
			if (shouldUnarchive) {
				const s = createSpinner({
					message: `Un-archiving product [${result.id}]`,
				});
				await updateProduct({productId: result.id, update: {archived: false}});
				s.success(`Product [${result.id}] un-archived successfully!`);
				productDecisions.set(result.id, true);
			} else {
				productDecisions.set(result.id, false);
			}
		}

		if (result.will_version) {
			const shouldUpdate = await confirm({
				message: `Product ${result.id} has customers on it and updating it will create a new version.\nAre you sure you'd like to continue? `,
			});
			productDecisions.set(result.id, shouldUpdate);
		} else {
			productDecisions.set(result.id, true);
		}
	}

	return productDecisions;
};

const pushProducts = async ({
	products,
	curProducts,
	productDecisions,
}: {
	products: Product[];
	curProducts: any[];
	productDecisions: Map<string, boolean>;
}) => {
	const s2 = initSpinner(`Pushing products`);
	const batchProducts = [];

	for (const product of products) {
		const shouldUpdate = productDecisions.get(product.id);
		batchProducts.push(
			upsertProduct({curProducts, product, spinner: s2, shouldUpdate}),
		);
	}

	const prodResults = await Promise.all(batchProducts);
	s2.success(`Products pushed successfully!`);
	console.log(chalk.dim('\nProducts pushed:'));
	prodResults.forEach((result: {id: string; action: string}) => {
		const action = result.action;
		console.log(
			chalk.cyan(
				`  • ${result.id} ${action === 'skipped' ? `(${action})` : ''}`,
			),
		);
	});
	console.log(); // Empty line for spacing

	return prodResults;
};

const gatherFeatureDeletionDecisions = async ({
	featuresToDelete,
}: {
	featuresToDelete: string[];
}) => {
	const featureDeletionDecisions = new Map<
		string,
		'delete' | 'archive' | 'skip'
	>();
	const batchCheckFeatures = [];

	for (const featureId of featuresToDelete) {
		batchCheckFeatures.push(checkFeatureDeletionData({featureId}));
	}

	const checkFeatureResults = await Promise.all(batchCheckFeatures);

	for (let i = 0; i < featuresToDelete.length; i++) {
		const featureId = featuresToDelete[i];
		const result = checkFeatureResults[i];

		if (!featureId) continue;

		if (result && result.totalCount > 0) {
			const otherProductsText =
				result.totalCount > 1
					? ` and ${result.totalCount - 1} other products`
					: '';
			const productNameText = result.productName || 'Unknown Product';
			const shouldArchive = await confirm({
				message: `Feature ${featureId} is being used by product ${productNameText}${otherProductsText}. As such, you cannot delete it. Would you like to archive the feature instead?`,
			});
			featureDeletionDecisions.set(
				featureId,
				shouldArchive ? 'archive' : 'skip',
			);
		} else {
			featureDeletionDecisions.set(featureId, 'delete');
		}
	}

	return featureDeletionDecisions;
};

const handleFeatureDeletion = async ({
	featuresToDelete,
	yes,
}: {
	featuresToDelete: string[];
	yes: boolean;
}) => {
	const featureDeletionDecisions = await gatherFeatureDeletionDecisions({
		featuresToDelete,
	});

	for (const featureId of featuresToDelete) {
		const decision = featureDeletionDecisions.get(featureId);

		if (decision === 'delete') {
			const shouldDelete =
				yes ||
				(await confirm({
					message: `Delete feature [${featureId}]?`,
				}));

			if (shouldDelete) {
				const s = createSpinner({message: `Deleting feature [${featureId}]`});
				await deleteFeature({id: featureId});
				s.success(`Feature [${featureId}] deleted successfully!`);
			}
		} else if (decision === 'archive') {
			const s = createSpinner({message: `Archiving feature [${featureId}]`});
			await updateFeature({id: featureId, update: {archived: true}});
			s.success(`Feature [${featureId}] archived successfully!`);
		}
	}
};

const showSuccessMessage = ({env, prod}: {env: string; prod: boolean}) => {
	console.log(
		chalk.magentaBright(`Success! Changes have been pushed to ${env}.`),
	);

	if (prod) {
		console.log(
			chalk.magentaBright(
				`You can view the products at ${FRONTEND_URL}/products`,
			),
		);
	} else {
		console.log(
			chalk.magentaBright(
				`You can view the products at ${FRONTEND_URL}/sandbox/products`,
			),
		);
	}
};

export default async function Push({
	config,
	yes,
	prod,
}: {
	config: {
		features: Feature[];
		products: Product[];
		env: string;
	};
	yes: boolean;
	prod: boolean;
}) {
	const {features, products, env} = config;

	if (env === 'prod') {
		const shouldProceed = await confirm({
			message:
				'You are about to push products to your prod environment. Are you sure you want to proceed?',
			default: false,
		});
		if (!shouldProceed) {
			console.log(chalk.yellow('Aborting...'));
			process.exit(1);
		}
	}

	const {allFeatures, curProducts, featuresToDelete, productsToDelete} =
		await checkForDeletables(features, products);

	await handleProductDeletion({productsToDelete, yes});
	await pushFeatures({features, allFeatures});

	const productDecisions = await gatherProductDecisions({
		products,
		curProducts,
	});
	await pushProducts({products, curProducts, productDecisions});
	await handleFeatureDeletion({featuresToDelete, yes});

	showSuccessMessage({env, prod});
}
