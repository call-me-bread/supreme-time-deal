package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.order.vo.PG
import java.time.LocalDateTime

class PaymentMethod(
	var pg: PG,
	var createdAt: LocalDateTime,
	var deatedAt: LocalDateTime,
)
