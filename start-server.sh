#!/bin/bash
# Starts the Spring Boot backend using the locally cached Maven
MVN="/c/Users/Teju/.m2/wrapper/dists/apache-maven-3.9.14-bin/1cb7fhup6b5n3bed6kckbrnspv/apache-maven-3.9.14/bin/mvn"
export JAVA_HOME="/c/Program Files/Java/jdk-17"
export PATH="$JAVA_HOME/bin:$PATH"
$MVN -f server/pom.xml spring-boot:run
