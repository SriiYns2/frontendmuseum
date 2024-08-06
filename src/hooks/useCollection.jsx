import * as React from 'react';

import { BASE_URL } from '@/lib/constants';
import axios from '@/lib/axios';
import { isAxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';

const useCollection = () => {
	const { toast } = useToast();

	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [collections, setCollections] = React.useState([]);

	React.useEffect(() => {
		setLoading(true);
		setError(null);

		const fetchData = async () => {
			try {
				const { data } = await axios.get('collection');

				setCollections(
					data.data.map((collection) => ({
						...collection,
						image_url: BASE_URL + collection.image_url,
						audio_url_id: BASE_URL + collection.audio_url_id,
						audio_url_en: BASE_URL + collection.audio_url_en,
						audio_url_sasak: BASE_URL + collection.audio_url_sasak,
					}))
				);
			} catch (error) {
				if (isAxiosError(error)) {
					toast({
						title: 'Error',
						description: error.response?.data?.message,
						variant: 'destructive',
					});
				} else {
					toast({
						title: 'Error',
						description: error.message,
						variant: 'destructive',
					});
				}
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [toast]);

	const handleDelete = async (id) => {
		setLoading(true);
		setError(null);

		try {
			await axios.delete('collection/' + id);
			setCollections(
				collections.filter((collection) => collection._id !== id)
			);
			toast({
				title: 'Success',
				description: 'Collection deleted successfully',
				variant: 'success',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error.response?.data?.message,
				variant: 'destructive',
			});
			setError(error.message || 'Failed to delete data');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		collections,
		handleDelete,
	};
};

export default useCollection;
