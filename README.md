# React Forms

This library is a fully extensible, object oriented library for performing abstract for submissions and validations.

### The form model

The problem with the traditional form model is that it is inflexible. Some issues that may arise from this are as follows:

    - custom interfaces may be difficult. Creating a ui against Dom elements often involves manipulating values and using selectors to get and set values in hidden fields. Form elements natively do not support svg UI elements, severely limiting UX



### React and the form

Often times in React, it becomes difficult to manage validation states and values. It often requires storing values and states in the parent component, or worse a global state manager such as redux. To make matters worse, validation often involves writing complex and messy data structures directly in jsx.




## The solution

This library has two key abstract components that perform much of the validation logic.

<Form> 

This element represents a submittable chunk of a Form. At the root level, this represents the entire form request as JSON. This is inherently a FormElement. What this means is that Forms may be nested to create structured responses and nested JSON objects. However the root level form should contain the large majority of form settings and submit handler.

The children of this element may be any type. If the form detects any form elements in its children, the children will register themselves with the form on mount and derigister on unmount. from there, the form is responsible for triggering validation on the element, maintaining the validation states of its children and constructing the submission request from the children.

<FormElement>

This is an abstract class that may be extended to put custom elements in the form. The implementation is responsible for a few things:
    1.) implementing a value prop which is what the form gets from the component when creating the submission request.
    2.) implementing the render method to display the component. This may be anything, including svg.





# The Form

# The Form Element


## Extending the FormElement

## The GroupableElement

## The InputGroup

An input group is a form element that may have multiple groupable elements within it. These elements work together to act as a single element with a single vale. An example of the use of an input group could be for a radio button collection, a selectable button selection or a checkbox collection that may have one or multiple values.

## Built in FormElements
- Form (Yes this is a form element)
    - A sub container for form elements. When not root form, on submit and validation settings do nothing. This is designed to provide a framework for nested JSON values.
- Text Input
    - A plain old textbox
- Text Area
    - A multi line text box
- Input Group
    - a container for GroupableElements that allow selectability. 
- HiddenField
    - A from element that stores a constant value. It renders nothing
- RadioButon (GroupableElement)
    - Represents a radio button that is selectable. Unlike native radio buttons, this is a facade of a checkbox to allow multiple selection when in a group.
- Checkbox (GroupableElement)
    - a facade for the native checkbox that works by itself or as part of a group.
- Button (GroupableElement)
    - a clickable button that may take an action. When submittable prop is supplied, it submits the rot form. They may have a value as part of a group or separately.


## Styling Built in components

# Validation

## How validation works

## When is an element validated

## Specifying validation rules

