tasks.getByName("bootJar") {
	enabled = true
}

tasks.getByName("jar") {
	enabled = false
}

dependencies {
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}
