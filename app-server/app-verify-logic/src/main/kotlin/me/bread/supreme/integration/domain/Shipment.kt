package me.bread.supreme.integration.domain

import java.math.BigDecimal

class Shipment(
	val billingAddress: Address,
	// TODO. VO 묶기
	val senderName: String,
	val receiverName: String,
	val shippingPrice: BigDecimal,
	val senderPhoneNumber: String,
	val receiverPhoneNumber: String,
) {
	fun add() {}

	fun status() {}
}
