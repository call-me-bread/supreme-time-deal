package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.order.vo.BuyerInfo
import java.math.BigDecimal

class Shipment(
	val shippingPrice: BigDecimal,
	val buyerInfo: BuyerInfo
) {
	fun add() {}

	fun status() {}
}
