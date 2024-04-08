package me.bread.supreme.order.domain.entity

import jakarta.persistence.*

@Table(name = "orders")
class Order(
	var id: Long? = null,
) {
	fun change(orderItem: OrderItem) {}

	fun timeOver() {}

	fun paymentMethod() {}

	fun options() {}

	fun deliveryFee() {}

	fun pay() {}

	fun appendAddress() {}

	fun appendPhoneNumber(number: String) {}

	fun invoice() {}
}
