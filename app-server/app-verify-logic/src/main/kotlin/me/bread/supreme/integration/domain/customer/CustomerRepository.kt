package me.bread.supreme.integration.domain.customer

interface CustomerRepository {
	fun save(customer: Customer): Customer
}
