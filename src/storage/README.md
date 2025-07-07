# Storage System

This directory contains the implementation of the file-based storage system for the Sacros application using Tauri's Store plugin.

## Overview

The storage system uses Tauri's Store plugin to persist the following data in JSON files stored in the application's data directory:

- **Food Database**: A collection of food items with their nutritional information
- **Today's Meals**: The meals and food entries for the current day
- **Daily Targets**: The user's nutritional targets

## Files

- `storageService.ts`: Main service for reading and writing data using Tauri's Store plugin

## Storage Files

- `foods.json`: Stores the food database
- `meals.json`: Stores today's meals
- `targets.json`: Stores the daily targets

## Storage Location

Data is stored in the application's data directory managed by Tauri:

- **Windows**: `%APPDATA%\Sacros\`
- **macOS**: `~/Library/Application Support/Sacros/`
- **Linux**: `~/.config/Sacros/`

## Usage

The storage service provides the following functions:

- `initializeStorage()`: Initialize the storage system
- `getFoods()`: Get the food database
- `saveFoods(foods)`: Save the food database
- `getTodayMeals()`: Get today's meals
- `saveTodayMeals(meals)`: Save today's meals
- `getDailyTargets()`: Get the daily targets
- `saveDailyTargets(targets)`: Save the daily targets 