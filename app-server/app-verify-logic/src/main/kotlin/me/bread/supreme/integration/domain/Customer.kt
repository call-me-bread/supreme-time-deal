package me.bread.supreme.integration.domain

class Customer(
	val role: Role,
	val address: Address,
	val secret: Secret,
) {
	fun updateShippingAddress(
		city: String,
		province: String,
		country: String,
	) {
		this.address.update(city, province, country)
	}

	fun checkPhoneNumberAuthorized(): Boolean {
		return secret.phoneAuth()
	}
}
