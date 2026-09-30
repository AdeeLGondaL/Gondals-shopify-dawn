#!/usr/bin/env python3
"""Validate JSON template/section-group/settings values against Liquid schema (range steps, select options)."""
import json, re, glob, sys

def load_json(p):
    s = open(p).read()
    s = re.sub(r'^\s*/\*.*?\*/', '', s, flags=re.S)
    return json.loads(s)

def schema_of(section_type):
    p = f'sections/{section_type}.liquid'
    try:
        s = open(p).read()
    except FileNotFoundError:
        return None
    m = re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}', s, re.S)
    return json.loads(m.group(1)) if m else None

errors = []

def check(where, defs, values):
    by_id = {d['id']: d for d in defs if 'id' in d}
    for k, v in (values or {}).items():
        d = by_id.get(k)
        if d is None:
            errors.append(f'{where}: unknown setting "{k}"')
            continue
        t = d['type']
        if t == 'range':
            lo, hi, st = d['min'], d['max'], d.get('step', 1)
            if not isinstance(v, (int, float)) or v < lo or v > hi or abs(((v - lo) / st) - round((v - lo) / st)) > 1e-9:
                errors.append(f'{where}: {k}={v} not in range {lo}..{hi} step {st}')
        elif t in ('select', 'radio'):
            opts = [o['value'] for o in d['options']]
            if v not in opts:
                errors.append(f'{where}: {k}={v!r} not in {opts}')

# global settings
schema = load_json('config/settings_schema.json')
gdefs = [s for grp in schema for s in grp.get('settings', [])]
data = load_json('config/settings_data.json')
cur = data['current'] if isinstance(data['current'], dict) else data['presets'][data['current']]
gvals = {k: v for k, v in cur.items() if k not in ('sections', 'color_schemes', 'blocks')}
check('settings_data', gdefs, gvals)

# templates and groups
for p in glob.glob('templates/*.json') + glob.glob('sections/*.json'):
    j = load_json(p)
    for sid, sec in j.get('sections', {}).items():
        sch = schema_of(sec['type'])
        if not sch:
            continue
        check(f'{p}:{sid}', sch.get('settings', []), sec.get('settings'))
        btypes = {b['type']: b for b in sch.get('blocks', [])}
        for bid, b in (sec.get('blocks') or {}).items():
            bs = btypes.get(b['type'])
            if bs is None:
                if b['type'] not in ('@app',) and not b['type'].startswith('shopify://'):
                    errors.append(f'{p}:{sid}:{bid}: unknown block type {b["type"]}')
                continue
            check(f'{p}:{sid}:{bid}', bs.get('settings', []), b.get('settings'))

print('\n'.join(errors) if errors else 'OK: all settings valid')
sys.exit(1 if errors else 0)
