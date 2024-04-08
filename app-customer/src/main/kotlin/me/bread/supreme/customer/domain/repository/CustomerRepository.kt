package me.bread.supreme.customer.domain.repository

import me.bread.supreme.customer.domain.entity.Customer

interface CustomerRepository {
	fun save(customer: Customer)
}
