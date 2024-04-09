package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.order.vo.BuyerInfo
import me.bread.supreme.integration.domain.order.vo.DeliveryStatus
import java.time.LocalDateTime

class Delivery(
	var order: Order,
	var buyerInfo: BuyerInfo,
	var status: DeliveryStatus,
	var description: String,
	var createdAt: LocalDateTime,
	var finishedAt: LocalDateTime
)
