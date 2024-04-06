package me.bread.supreme.order.domain.entity

import jakarta.persistence.*

@Table(name = "time_limit")
class TimeLimit(
	var id: Long? = null,
)
