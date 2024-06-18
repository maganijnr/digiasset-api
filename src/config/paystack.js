import fetch from "node-fetch";
const MYSecretKey = process.env.PAYSTACK_SECRET_KEY;

const paystack = () => {
	const initializePayment = async (form) => {
		const response = await fetch(
			"https://api.paystack.co/transaction/initialize",
			{
				method: "POST",
				body: JSON.stringify(form),
				headers: {
					authorization: `Bearer ${MYSecretKey}`,
					"content-type": "application/json",
					"cache-control": "no-cache",
				},
			}
		);

		const data = await response.json();

		return data;
	};

	const verifyPayment = async (ref) => {
		const response = await fetch(
			`https://api.paystack.co/transaction/verify/${ref}`,
			{
				method: "GET",
				headers: {
					authorization: `Bearer ${MYSecretKey}`,
					"content-type": "application/json",
					"cache-control": "no-cache",
				},
			}
		);

		const data = await response.json();

		return data;
	};

	return {
		initializePayment,
		verifyPayment,
	};
};

export default paystack;
