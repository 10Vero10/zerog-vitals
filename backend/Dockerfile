# Etapa 1: compilar con Maven (JDK 21)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline
COPY src src
RUN ./mvnw -B -q package -DskipTests -Dspotless.check.skip=true

# Etapa 2: ejecutar con JRE 21
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 zerog
COPY --from=build /app/target/*.jar app.jar
USER zerog
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
