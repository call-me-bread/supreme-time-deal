package me.bread.supreme.integration.domain

enum class OrderStatus {
	// 주문 대기
	PENDING,

	// 결제 완료
	PAYED,

	// 배송 완료
	DELIVERED,
}
