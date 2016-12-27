//RF//Championship
========================

Welcome to the //RF//Championship system - a functional web
application that you can use to manage team and events.

This document contains information on how to download, install, and start
using //RF//Championship.

1) Installing the Requirements
----------------------------------

When it comes to installing //RF//Championship, you have to use composer.

### Use Composer

As //RF//Championship uses Symfony 2 and [Composer] to manage its dependencies, you have to use it.

If you don't have Composer yet, download it following the instructions on
http://getcomposer.org/ or just run the following command in the root folder:

    curl -s http://getcomposer.org/installer | php

Then, use the `create-project` command to generate a new Symfony application:

    php composer.phar update

Composer will install //RF//Championship and Symfony and all its dependencies under the
`path/to/install` directory.

2) Checking your System Configuration
-------------------------------------

Before starting using it, you have to run the main database setup and you have to make sure 
that your local system is properly configured for //RF//Championship.

Execute the `check.php` script from the command line:

    php app/check.php

The script returns a status code of `0` if all mandatory requirements are met,
`1` otherwise.

Access the `config.php` script from a browser:

    http://localhost/path/to/RFChampionship/app/web/config.php

If you get any warnings or recommendations, fix them before moving on.

3) Install the database
--------------------------------

Execute the database create process from the command line:

	php app/console doctrine:schema:create

4) Browsing the Application
--------------------------------

Congratulations! You're now ready to use //RF//Championship.

From the `config.php` page, click the "Bypass configuration and go to the
Welcome page" link to load up your first Symfony page.

You can also use a web-based configurator by clicking on the "Configure your
Symfony Application online" link of the `config.php` page.

To see a real-live Symfony page in action, access the following page:

    web/app_dev.php/
