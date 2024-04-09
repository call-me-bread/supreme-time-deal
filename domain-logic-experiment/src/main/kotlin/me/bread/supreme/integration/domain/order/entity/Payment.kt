package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.money.Money
import me.bread.supreme.integration.domain.order.vo.PaymentStatus
import java.time.LocalDateTime

class Payment(
	var totalPrice: Money,
	var transaction: Transaction,
	var paymentMethod: PaymentMethod,
	var status: PaymentStatus,
	var createdAt: LocalDateTime,
	var updatedAt: LocalDateTime
) {

	fun payed(order: Order) {
		this.transaction.record(order.accountId, order.totalPrice())

		this.status = PaymentStatus.DONE
	}

	fun pay(totalPrice: Money, paymentMethod: PaymentMethod) {
		this.totalPrice = totalPrice
		this.paymentMethod = paymentMethod

		this.status = PaymentStatus.PENDING
	}
}
