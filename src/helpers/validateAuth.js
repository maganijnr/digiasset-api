const regex =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const validateSignUp = (fullName, email, password) => {
	if (!fullName) {
		return {
			message: "Full name is required",
		};
	}

	if (!email) {
		return {
			message: "Email is required",
		};
	} else if (!email.toLowerCase().match(regex)) {
		return {
			message: "A valid email address is required",
		};
	}

	if (!password) {
		return {
			message: "Password is required",
		};
	}

	return null;
};

export const validateSignIn = (email, password) => {
	if (!email) {
		return {
			message: "Email is required",
		};
	} else if (!email.toLowerCase().match(regex)) {
		return {
			message: "A valid email address is required",
		};
	}

	if (!password) {
		return {
			message: "Password is required",
		};
	}

	return null;
};
