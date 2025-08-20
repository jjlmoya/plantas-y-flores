#!/usr/bin/env python3
"""
Script to analyze all calendar JSON files and extract unique options/values
for creating a comprehensive documentation reference.
"""

import json
import os
import sys
from pathlib import Path
from collections import defaultdict


def collect_unique_values(data, current_path="", collected_values=None):
    """Recursively collect all unique values from nested JSON structure"""
    if collected_values is None:
        collected_values = defaultdict(set)
    
    if isinstance(data, dict):
        for key, value in data.items():
            new_path = f"{current_path}.{key}" if current_path else key
            
            if isinstance(value, (dict, list)):
                collect_unique_values(value, new_path, collected_values)
            else:
                # Store the value under its full path
                collected_values[new_path].add(str(value))
    
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, (dict, list)):
                collect_unique_values(item, current_path, collected_values)
            else:
                # For list items, use the parent path
                collected_values[current_path].add(str(item))
    
    return collected_values


def analyze_monthly_tasks(data, task_values=None):
    """Specifically analyze monthly_tasks to collect all unique task keys"""
    if task_values is None:
        task_values = set()
    
    # Look for care_calendar.monthly_tasks
    if isinstance(data, dict):
        if 'care_calendar' in data and isinstance(data['care_calendar'], dict):
            monthly_tasks = data['care_calendar'].get('monthly_tasks', {})
            if isinstance(monthly_tasks, dict):
                for month, tasks in monthly_tasks.items():
                    if isinstance(tasks, list):
                        task_values.update(tasks)
        
        # Recursively search in nested structures
        for value in data.values():
            if isinstance(value, (dict, list)):
                analyze_monthly_tasks(value, task_values)
    
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                analyze_monthly_tasks(item, task_values)
    
    return task_values


def main():
    calendar_dir = Path(r"C:\Users\34677\Desktop\plantasyflroes\public\data\calendar")
    
    if not calendar_dir.exists():
        print(f"Calendar directory not found: {calendar_dir}")
        return
    
    all_values = defaultdict(set)
    monthly_tasks = set()
    file_count = 0
    
    # Find all JSON files (excluding global-config.json)
    for json_file in calendar_dir.rglob("*.json"):
        if json_file.name == "global-config.json":
            continue
            
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Collect all unique values
            file_values = collect_unique_values(data)
            for path, values in file_values.items():
                all_values[path].update(values)
            
            # Specifically collect monthly tasks
            file_tasks = analyze_monthly_tasks(data)
            monthly_tasks.update(file_tasks)
            
            file_count += 1
            if file_count % 20 == 0:
                print(f"Processed {file_count} files...")
                
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    print(f"Analyzed {file_count} JSON files")
    
    # Print results in a structured way
    print("\n" + "="*80)
    print("MONTHLY TASKS (care_calendar.monthly_tasks)")
    print("="*80)
    sorted_tasks = sorted(monthly_tasks)
    for task in sorted_tasks:
        print(f"  - {task}")
    
    print(f"\nTotal unique monthly tasks: {len(sorted_tasks)}")
    
    # Group related paths
    print("\n" + "="*80)
    print("ALL DATA FIELDS AND VALUES")
    print("="*80)
    
    # Sort paths for better organization
    sorted_paths = sorted(all_values.keys())
    
    current_section = ""
    for path in sorted_paths:
        # Skip meta fields and some internal fields
        if path.startswith("_meta") or path == "key":
            continue
            
        section = path.split('.')[0]
        if section != current_section:
            print(f"\n--- {section.upper()} ---")
            current_section = section
        
        values = sorted(all_values[path])
        print(f"\n{path}:")
        for value in values:
            print(f"  - {value}")
        print(f"  Total: {len(values)} unique values")


if __name__ == "__main__":
    main()