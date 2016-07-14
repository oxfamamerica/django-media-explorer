#!/usr/bin/env python

from setuptools import find_packages
from setuptools import setup

from media_explorer import __version__ as version

#http://pandoc.org/try/
with open('README.rst') as f:
    readme = f.read()

#try:
#    from pypandoc import convert
#    read_md = lambda f: convert(f, 'rst')
#except ImportError:
#    print("warning: pypandoc module not found, could not convert Markdown to RST")
#    read_md = lambda f: open(f, 'r').read()

setup(
    name='django-media-explorer',
    version=version,
    description='A Django application to manage your images, video links, embeds and slideshows.',
    #long_description=read_md('README.md'),
    long_description=readme,
    license='MIT',
    author='Oxfam America Web Team',
    author_email='webmaster@oxfamamerica.org',
    url='https://github.com/oxfamamerica/django-media-explorer',
    download_url='https://pypi.python.org/pypi/django-media-explorer/',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'django>=1.7,<1.9',
        'micawber==0.3.2',
        'djangorestframework==3.0.0',
        'Pillow==2.6.1',
        'django-ckeditor==4.4.8',
    ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'License :: OSI Approved :: MIT License',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Multimedia :: Video',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
    keywords=['multimedia', 'media', 'video', 'gallery'],
)

