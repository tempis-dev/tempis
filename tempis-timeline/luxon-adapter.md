Could have a separate date adapter repo for luxon.

``` ts
// In @tempis/luxon-adapter package
import { DateTime } from 'luxon';
import { TempisTimelineDateAdapter, TimeInstant, DateInput } from '@tempis/timeline';

export class LuxonAdapter implements TempisTimelineDateAdapter {
  constructor(private timezone: string = 'local') {}
  
  parse(input: DateInput): TimeInstant | null {
    const dt = DateTime.fromJSDate(input instanceof Date ? input : new Date(input));
    return dt.isValid ? dt.toMillis() : null;
  }
  
  startOf(instant: TimeInstant, unit: Unit): TimeInstant {
    return DateTime.fromMillis(instant, { zone: this.timezone })
      .startOf(unit)
      .toMillis();
  }
  
  add(instant: TimeInstant, unit: Unit, amount: number): TimeInstant {
    return DateTime.fromMillis(instant, { zone: this.timezone })
      .plus({ [unit]: amount })
      .toMillis();
  }
  
  format(instant: TimeInstant, pattern: string): string {
    // Map your pattern strings to Luxon format tokens
    return DateTime.fromMillis(instant, { zone: this.timezone })
      .toFormat(this._convertPattern(pattern));
  }
}
```

Users would then hook it up
``` ts
// app.ts or main.ts
import { TempisTimeline } from '@tempis/timeline';
import { LuxonAdapter } from '@tempis/luxon-adapter';

// Register once at startup
TempisTimeline.registerDateAdapter(new LuxonAdapter('America/New_York'));

// Then create as many timeline instances as you want
const timeline1 = new TempisTimeline(container1, options1);
const timeline2 = new TempisTimeline(container2, options2);
// Both will use the same registered adapter
```