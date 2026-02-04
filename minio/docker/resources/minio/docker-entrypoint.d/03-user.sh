#!/bin/sh
set -e

mc admin user add local appuser apppassword
mc admin policy attach local readwrite --user appuser
