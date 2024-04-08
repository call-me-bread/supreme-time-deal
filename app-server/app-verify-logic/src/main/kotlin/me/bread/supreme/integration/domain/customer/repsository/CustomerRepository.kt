package me.bread.supreme.integration.domain.customer.repsository

import me.bread.supreme.integration.domain.customer.entity.Customer

interface CustomerRepository {
	fun save(customer: Customer): Customer
}
