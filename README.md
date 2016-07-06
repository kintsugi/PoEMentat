# PoEMentat

Path of Exile currency market speculation and trading tool.

##Purpose

Update Scambot to work with the current currency.poe.trade site as well as improve it with new features. The original purpose of Scambot was to automate updating currency orders on the site. This project aims to decouple the client interface for managing orders from the web server that parsed the currency data. This decoupling will simplify the project and allow for additional features to be added, such as data analysis to generate pretty graphs as well as improve on the price optimzation algorithms.

##Alpha Goal
* Web server running on an instance that monitors the trade site, recording the price data and generating data points for graph generation.
* Improved client interface with the similar functions to the existing Scambot.
