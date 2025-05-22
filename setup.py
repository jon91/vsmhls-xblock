"""Setup for vsmhls XBlock."""


import os

from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}

# Read runtime requirements from requirements.txt
with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name='vsmhls-xblock',
    version='0.2',
    description='HLS Video XBlock for Open edX with advanced playback features',
    author='jon91',
    author_email='jon9544@mgmail.com',
    license='Apache 2.0',
    packages=[
        'vsmhls',
    ],
    install_requires=requirements,
    entry_points={
        'xblock.v1': [
            'vsmhls = vsmhls:VSMHLSXBlock',
        ]
    },
    package_data=package_data("vsmhls", ["static", "public"]),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Education',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Topic :: Education',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)