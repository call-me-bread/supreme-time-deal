package me.bread.supreme.customer.web.controller

import me.bread.supreme.customer.application.business.CustomerService
import me.bread.supreme.customer.web.dto.RegisterHttpRequest
import me.bread.supreme.support.wrapper.ApiResponseWrapper
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class RegisterApi(
	private val customerService: CustomerService,
) {
	@PostMapping("/v1/customer/register")
	fun register(
		@RequestBody dto: RegisterHttpRequest,
	): ApiResponseWrapper {
		return ApiResponseWrapper.success(customerService.register(dto.meaningful()))
	}
}
