import re

with open(r'c:\Users\ayush\projects\ecotrace-india\src\components\Quiz.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Imports and PropTypes
code = code.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport PropTypes from 'prop-types';")

# Replace constants
code = code.replace("""  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid var(--color-line)', fontSize: '16px',
    background: 'white', boxSizing: 'border-box'
  };

  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-ink)' };

  const btnGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px' };""", """  const inputClass = "w-full p-[12px_16px] rounded-xl border border-[var(--color-line)] text-base bg-white box-border";
  const labelClass = "block text-sm font-semibold mb-2 text-[var(--color-ink)]";
  const btnGroupClass = "flex flex-wrap gap-2.5";""")

# Update references to constants
code = code.replace("style={inputStyle}", "className={inputClass}")
code = code.replace("style={labelStyle}", "className={labelClass}")
code = code.replace("style={btnGroupStyle}", "className={btnGroupClass}")
code = code.replace("style={{ ...inputStyle, WebkitAppearance: 'none' }}", 'className={`${inputClass} appearance-none`}')

# SelectableBtn
old_btn = """  const SelectableBtn = ({ field, value, label }) => (
    <button
      onClick={() => updateAnswer(field, value)}
      style={{
        padding: '10px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 600,
        background: answers[field] === value ? 'var(--color-banyan)' : 'white',
        color: answers[field] === value ? 'white' : 'var(--color-ink)',
        border: `1px solid ${answers[field] === value ? 'var(--color-banyan)' : 'var(--color-line)'}`,
        cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );"""

new_btn = """  const SelectableBtn = ({ field, value, label }) => (
    <button
      type="button"
      onClick={() => updateAnswer(field, value)}
      className={`px-[18px] py-[10px] rounded-[20px] text-sm font-semibold cursor-pointer transition-all duration-200 border ${answers[field] === value ? 'bg-[var(--color-banyan)] text-white border-[var(--color-banyan)]' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}
    >
      {label}
    </button>
  );

  SelectableBtn.propTypes = {
    field: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  };"""

code = code.replace(old_btn, new_btn)

# Inline styles replacements
code = code.replace("""<div className="shell" style={{ maxWidth: '640px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>""", """<div className="shell max-w-[640px] min-h-[80vh] flex flex-col justify-center">""")
code = code.replace("""<div className="card" style={{ padding: '40px' }}>""", """<div className="card p-10">""")
code = code.replace("""<div style={{ marginBottom: '32px' }}>""", """<div className="mb-8">""")
code = code.replace("""<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', opacity: 0.5, marginBottom: '8px' }}>""", """<div className="flex justify-between text-[13px] font-bold text-[var(--color-ink)] opacity-50 mb-2">""")
code = code.replace("""<div style={{ height: '6px', background: 'var(--color-paper-2)', borderRadius: '3px', overflow: 'hidden' }}>""", """<div className="h-1.5 bg-[var(--color-paper-2)] rounded-[3px] overflow-hidden">""")
code = code.replace("""<div style={{ height: '100%', background: 'var(--color-banyan)', width: `${step * 20}%`, transition: 'width 0.3s ease-out' }}></div>""", """<div className="h-full bg-[var(--color-banyan)] transition-[width] duration-300 ease-out" style={{ width: `${step * 20}%` }}></div>""")
code = code.replace("""<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>""", """<div className="flex flex-col gap-6">""")
code = code.replace("""<h2 className="display" style={{ fontSize: '28px' }}>""", """<h2 className="display text-[28px]">""")
code = code.replace("""<div style={{ display: 'flex', gap: '16px' }}>""", """<div className="flex gap-4">""")
code = code.replace("""<div style={{ flex: 1 }}>""", """<div className="flex-1">""")
code = code.replace("""<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>""", """<div className="flex flex-col gap-2.5">""")
code = code.replace("""style={{ width: '100%', accentColor: 'var(--color-marigold)' }}""", """className="w-full accent-[var(--color-marigold)]" """)
code = code.replace("""<div style={{ fontSize: '12px', color: 'var(--color-ink)', opacity: 0.5, marginTop: '4px' }}>""", """<div className="text-xs text-[var(--color-ink)] opacity-50 mt-1">""")
code = code.replace("""<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-line)' }}>""", """<div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--color-line)]">""")
code = code.replace("""<button onClick={goBack} style={{ fontWeight: 600, color: 'var(--color-ink)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}>""", """<button type="button" onClick={goBack} className="font-semibold text-[var(--color-ink)] opacity-60 flex items-center gap-1.5 cursor-pointer border-none bg-transparent">""")
code = code.replace("""<button onClick={goNext} style={{ background: 'var(--color-ink)', color: 'white', padding: '14px 32px', borderRadius: '30px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none' }}>""", """<button type="button" onClick={goNext} className="bg-[var(--color-ink)] text-white px-8 py-3.5 rounded-[30px] font-bold text-[15px] cursor-pointer border-none">""")
code = code.replace("""<button onClick={submitQuiz} style={{ background: 'var(--color-marigold)', color: 'white', padding: '14px 32px', borderRadius: '30px', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 14px rgba(232,93,44,0.3)', cursor: 'pointer', border: 'none' }}>""", """<button type="button" onClick={submitQuiz} className="bg-[var(--color-marigold)] text-white px-8 py-3.5 rounded-[30px] font-bold text-[15px] shadow-[0_4px_14px_rgba(232,93,44,0.3)] cursor-pointer border-none">""")

with open(r'c:\Users\ayush\projects\ecotrace-india\src\components\Quiz.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Quiz.jsx updated.")
