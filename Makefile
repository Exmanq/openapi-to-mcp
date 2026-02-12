SHELL := /bin/bash

.PHONY: setup lint test demo doctor

setup:
	npm install

lint:
	npm run lint

test:
	npm run test

demo:
	npm run build
	npm run demo

doctor:
	npm run doctor
