browser.get("http://localhost:8080/#/");
browser.driver.manage().window().maximize();
element(by.css(".nav-login-btn")).click();
element(by.id("gebruikersnaam")).sendKeys("user");
element(by.id("wachtwoord")).sendKeys("user");
element(by.css(".login-form")).element(by.css(".login-btn")).click();