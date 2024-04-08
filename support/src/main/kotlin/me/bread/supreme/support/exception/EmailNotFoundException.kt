package me.bread.supreme.support.exception

class EmailNotFoundException(email: String) : RuntimeException(
	"Email: $email not found!",
)
