package me.bread.supreme.integration.domain.order

data class Address(
	// 시
	private var city: String,
	// 도
	private var province: String,
	// 군
	private var country: String,
) {
	fun update(
		city: String,
		province: String,
		country: String,
	) {
		this.city = city
		this.province = province
		this.country = country
	}
}
