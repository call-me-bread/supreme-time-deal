tasks.getByName("bootJar") {
	enabled = true
}

tasks.getByName("jar") {
	enabled = false
}

dependencies {
	val mockkVersion = "1.13.10"
	testImplementation("io.mockk:mockk:${mockkVersion}")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}
