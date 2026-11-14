package com.zerogvitals;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

/** Verifica la regla 1 del patrón de paquetes (SPEC 4.2). */
@AnalyzeClasses(packages = "com.zerogvitals", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

  @ArchTest
  static final ArchRule domainIsPureJava =
      noClasses()
          .that()
          .resideInAPackage("..domain..")
          .should()
          .dependOnClassesThat()
          .resideInAnyPackage(
              "org.springframework..",
              "jakarta.persistence..",
              "jakarta.servlet..",
              "com.zerogvitals.entity..",
              "com.zerogvitals.repository..",
              "com.zerogvitals.dto..",
              "com.zerogvitals.service..",
              "com.zerogvitals.controller..")
          .allowEmptyShould(true);

  @ArchTest
  static final ArchRule controllersOnlyTalkToServices =
      noClasses()
          .that()
          .resideInAPackage("..controller..")
          .should()
          .dependOnClassesThat()
          .resideInAnyPackage(
              "com.zerogvitals.repository..",
              "com.zerogvitals.entity..",
              "com.zerogvitals.domain..")
          .allowEmptyShould(true);

  @ArchTest
  static final ArchRule nothingDependsOnControllers =
      noClasses()
          .that()
          .resideOutsideOfPackage("..controller..")
          .should()
          .dependOnClassesThat()
          .resideInAPackage("com.zerogvitals.controller..")
          .allowEmptyShould(true);
}
