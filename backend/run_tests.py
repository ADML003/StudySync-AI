#!/usr/bin/env python3
"""
Test runner script for StudySync AI backend tests.
Provides convenient commands for running different types of tests.
"""

import sys
import subprocess
import argparse
from pathlib import Path


def run_command(cmd, description=""):
    """Run a command and handle errors"""
    if description:
        print(f"\n🔄 {description}")
        print("-" * 50)
    
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running: {cmd}")
        print(f"Exit code: {e.returncode}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="StudySync AI Test Runner")
    parser.add_argument(
        "test_type",
        choices=["all", "unit", "integration", "chains", "routes", "auth", "coverage", "lint"],
        help="Type of tests to run"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Verbose output"
    )
    parser.add_argument(
        "--fast", "-f",
        action="store_true",
        help="Skip slow tests"
    )
    parser.add_argument(
        "--file",
        help="Run tests from specific file"
    )
    
    args = parser.parse_args()
    
    # Base pytest command
    base_cmd = "python -m pytest"
    
    if args.verbose:
        base_cmd += " -v"
    
    if args.fast:
        base_cmd += ' -m "not slow"'
    
    # Test type specific commands
    commands = {
        "all": f"{base_cmd}",
        "unit": f"{base_cmd} -m unit",
        "integration": f"{base_cmd} -m integration",
        "chains": f"{base_cmd} test_chains.py",
        "routes": f"{base_cmd} test_routes.py",
        "auth": f"{base_cmd} -m auth",
        "coverage": f"{base_cmd} --cov=. --cov-report=html --cov-report=term",
        "lint": "echo 'Running linting checks...'; flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics"
    }
    
    if args.file:
        cmd = f"{base_cmd} {args.file}"
    else:
        cmd = commands.get(args.test_type)
    
    if not cmd:
        print(f"❌ Unknown test type: {args.test_type}")
        return 1
    
    print(f"🧪 Running {args.test_type} tests...")
    print(f"Command: {cmd}")
    
    success = run_command(cmd, f"Running {args.test_type} tests")
    
    if success:
        print(f"\n✅ {args.test_type.title()} tests completed successfully!")
        
        # Additional information based on test type
        if args.test_type == "coverage":
            print("\n📊 Coverage report generated in htmlcov/index.html")
        elif args.test_type == "all":
            print("\n📋 Test Summary:")
            print("  - Unit tests: ✅")
            print("  - Integration tests: ✅") 
            print("  - All tests passed!")
    else:
        print(f"\n❌ {args.test_type.title()} tests failed!")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())