package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.order.vo.Address
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
