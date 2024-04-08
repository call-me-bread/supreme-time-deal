package me.bread.supreme.order.domain.entity

import jakarta.persistence.*

@Table(name = "order_item")
class OrderItem(
	var id: Long? = null,
) {
	fun changeItem() {}
}
