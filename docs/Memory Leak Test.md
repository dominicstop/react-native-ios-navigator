
# Memory Leak Tests

## Test 1
* Date: `1/9/21 - 5:22 PM`
* Device: `Simulator, iPhone 8 (iOS 14.2)`
* Last Commit: `72d7837 `

```
Start   : 42.8 MB

PUSH 100: 64.6 MB - Add : 22.5 MB
POP  100: 56.0 MB - Lost: 8.6  MB - Extra: 13.2 MB

PUSH 100: 63.9 MB - Add : 7.9  MB
POP  100: 59.7 MB - Lost: 4.2  MB - Extra: 16.9 MB

PUSH 100: 68.5 MB - Add : 8.8  MB
POP  100: 64.0 MB - Lost: 4.5  MB - Extra: 21.2 MB

PUSH 100: 70.3 MB - Add : 6.3  MB
POP  100: 61.4 MB - Lost: 8.9  MB - Extra: 18.6 MB

PUSH 100: 69.0 MB - Add : 7.6  MB
POP  100: 62.2 MB - Lost: 6.8  MB - Extra: 19.4 MB

Gained: 45.3% since start.
```