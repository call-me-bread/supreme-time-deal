package me.bread.supreme.support.wrapper

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ApiResponseWrapper(
	val status: ApiStatus,
	val message: String?,
	val data: Any?,
) {
	companion object {
		fun success(data: Any?): ApiResponseWrapper {
			return ApiResponseWrapper(ApiStatus.SUCCESS, null, data)
		}

		fun error(message: String?): ApiResponseWrapper {
			return ApiResponseWrapper(ApiStatus.ERROR, message, null)
		}
	}

	enum class ApiStatus {
		SUCCESS,
		ERROR,
	}
}
