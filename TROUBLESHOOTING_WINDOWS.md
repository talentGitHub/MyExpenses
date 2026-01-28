# Troubleshooting npm PowerShell Execution Policy Issues on Windows

## Problem

When running npm commands on Windows PowerShell, you may encounter this error:

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded. The file C:\Program Files\nodejs\npm.ps1 is not digitally
signed. You cannot run this script on the current system. For more information about running scripts and setting
execution policy, see about_Execution_Policies at https://go.microsoft.com/fwlink/?LinkID=135170.
```

## Solution

This error occurs because PowerShell's execution policy is preventing unsigned scripts from running. Here are the solutions:

### Option 1: Change Execution Policy (Recommended)

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

This allows locally created scripts and signed remote scripts to run.

### Option 2: Use Command Prompt Instead

Instead of PowerShell, use Command Prompt (cmd.exe) to run npm commands:

```cmd
npm install
npm start
```

### Option 3: Bypass for Single Command

Run npm with execution policy bypass for a single command:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

## For CI/CD

If you're setting up CI/CD (like GitHub Actions) on Windows runners, ensure you configure the execution policy at the beginning of your workflow. See `.github/workflows/ci.yml` for an example.

## More Information

- [About Execution Policies](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [npm on Windows](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
