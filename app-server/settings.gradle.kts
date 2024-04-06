rootProject.name = "app-server"

include(
	":micro-services:authentication-service",
	":micro-services:order-service",
	":micro-services:payment-service",
	":micro-services:customer-service",
	":micro-services:cart-service",
	":micro-services:product-service",
	"app-verify-logic",
	"support",
	"api-gateway",
)
