from setuptools import setup

setup(
    name = 'stocks',
    version = '0.1',
    description = 'Stocks Asset Computation',
    long_description = 'This package would help you to have a track of all your stocks.',
    classifiers = ['Programming Language :: Python :: 3.6.4'],
    packages = ['stocks'],
    test_suite = 'stocks.tests'
)