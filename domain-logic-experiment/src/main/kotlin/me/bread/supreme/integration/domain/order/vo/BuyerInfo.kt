package me.bread.supreme.integration.domain.order.vo

data class BuyerInfo(
	val billingAddress: Address,
	val senderName: String,
	val receiverName: String,
	val senderPhoneNumber: String,
	val receiverPhoneNumber: String,
)
