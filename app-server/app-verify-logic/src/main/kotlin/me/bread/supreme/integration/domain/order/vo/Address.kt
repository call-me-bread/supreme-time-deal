package me.bread.supreme.integration.domain.order.vo

data class Address(
	// 시
	private var city: String,
	// 도
	private var province: String,
	// 상세 주소
	private var detail: String,
) {
	fun updateTo(address: Address): Address {
		return Address(address.city, address.province, address.detail)
	}
}
