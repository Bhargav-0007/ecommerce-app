@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
"C:\Users\Teju\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin\mvn.cmd" -f server\pom.xml spring-boot:run
