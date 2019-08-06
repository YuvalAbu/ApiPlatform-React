import React from 'react';

const Select = ({name, label, value, onChange, error= "", children}) =>
	( 
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<select 
				value={value}
				onChange={onChange}
				className={"form-control" + (error && " is-invalid")} 
				name={name} 
				id={name}
			>
				{children}
			</select>
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
 
export default Select;