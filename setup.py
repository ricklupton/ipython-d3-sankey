#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import (
    setup,
    find_packages,
)

try:
    from jupyterpip import cmdclass
except:
    import importlib
    import pip
    pip.main(['install', 'jupyter-pip'])
    cmdclass = importlib.import_module('jupyterpip').cmdclass


# load version without side-effects
__version__ = None
with open('ipythond3sankey/version.py') as f:
    exec(f.read())


setup(
    name='ipython-d3-sankey',
    version=__version__,
    description='an IPython widget for the d3 Sankey plugin',
    long_description=open('README.rst').read(),
    author='Rick Lupton',
    author_email='r.lupton@gmail.com',
    url='https://github.com/ricklupton/ipython-d3-sankey',
    packages=find_packages(include=['ipythond3sankey',
                                    'ipythond3sankey.widgets']),
    include_package_data=True,
    license='MIT',
    zip_safe=False,
    keywords='ipython-d3-sankey ipython',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3',
        'Topic :: Software Development :: Widget Sets',
        "Programming Language :: Python :: 2",
    ],
    tests_require=[
        "nose",
    ],
    setup_requires=[
        "IPython>=3.0.0,<5.0.0",
        "requests",
    ],
    install_requires=[
        "IPython>=3.0.0,<5.0.0",
    ],
    test_suite='nose.collector',
    cmdclass=cmdclass('ipythond3sankey/static/ipythond3sankey')
)
