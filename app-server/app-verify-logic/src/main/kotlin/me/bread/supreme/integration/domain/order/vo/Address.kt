package me.bread.supreme.integration.domain.order.vo

data class Address(
	// 시
	var city: String,
	// 도
	var province: String,
	// 상세 주소
	var detail: String,
) {
	fun updateTo(address: Address): Address {
		return Address(address.city, address.province, address.detail)
	}
}
