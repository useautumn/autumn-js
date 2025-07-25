import {Spinner} from 'yocto-spinner';
import {Feature, Product} from '../compose/index.js';
import {externalRequest} from './api.js';
import {getFeatures, getAllProducts} from './pull.js';
import {confirm} from '@inquirer/prompts';
export async function checkForDeletables(
	currentFeatures: Feature[],
	currentProducts: Product[],
) {
	const features = await getFeatures(); // Get from AUTUMN
	const featureIds = features.map((feature: Feature) => feature.id);
	const currentFeatureIds = currentFeatures.map(feature => feature.id);
	const featuresToDelete = featureIds.filter(
		(featureId: string) => !currentFeatureIds.includes(featureId),
	);

	const products = await getAllProducts();
	const productIds = products.map((product: Product) => product.id);
	const currentProductIds = currentProducts.map(
		(product: Product) => product.id,
	);
	const productsToDelete = productIds.filter(
		(productId: string) => !currentProductIds.includes(productId),
	);

	return {featuresToDelete, productsToDelete};
}

const isDuplicate = (error: any) => {
	return (
		error.response &&
		error.response.data &&
		(error.response.data.code === 'duplicate_feature_id' ||
			error.response.data.code === 'product_already_exists')
	);
};

export async function upsertFeature(feature: Feature) {
	if (!feature.name || feature.name.trim() === '') {
		console.error(
			`\nYou tried to create a feature without a name, please add a name to ${feature.id}`,
		);
		process.exit(1);
	}

	try {
		const response = await externalRequest({
			method: 'POST',
			path: `/features`,
			data: feature,
			throwOnError: true,
		});

		return response.data;
	} catch (error: any) {
		if (isDuplicate(error)) {
			const response = await externalRequest({
				method: 'POST',
				path: `/features/${feature.id}`,
				data: feature,
			});
			return response.data;
		}

		console.error(
			`\nFailed to push feature ${feature.id}: ${
				error.response?.data?.message || 'Unknown error'
			}`,
		);
		process.exit(1);
	}
}

export async function upsertProduct({
	product,
	spinner,
}: {
	product: Product;
	spinner: Spinner;
}) {
	// spinner.start();
	try {
		const response = await externalRequest({
			method: 'POST',
			path: `/products`,
			data: product,
			throwOnError: true,
		});
		spinner.success(`Pushed product [${product.id}]`);
	} catch (error: any) {
		if (isDuplicate(error)) {
			const res1 = await externalRequest({
				method: 'GET',
				path: `/products/${product.id}/has_customers`,
				data: product,
			});

			const {current_version, will_version} = res1;

			let shouldUpdate = true;
			if (will_version) {
				spinner.stop();
				// Clear the line to remove any spinner artifacts
				process.stdout.write('\r\x1b[K');
				shouldUpdate = await confirm({
					message: `Product ${product.id} has customers on it and updating it will create a new version.\nAre you sure you'd like to continue? `,
				});
			}

			if (shouldUpdate) {
				// If the first request fails, try posting to the specific product ID endpoint
				spinner.start();
				const response = await externalRequest({
					method: 'POST',
					path: `/products/${product.id}`,
					data: product,
				});

				spinner.success(`Pushed product [${product.id}]`);
				return response;
			} else {
				spinner.info(`Skipping update to product ${product.id}`);
				return;
			}
		}

		console.error(
			`\nFailed to push product ${product.id}: ${
				error.response?.data?.message || 'Unknown error'
			}`,
		);
		process.exit(1);
	}
}
