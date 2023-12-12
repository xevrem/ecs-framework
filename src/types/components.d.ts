import { Component } from '../Component';
import { Option } from './common';

export declare type ComponentType = typeof Component;
export declare type ComponentTypes = ComponentType[];

export declare type ComponentOptionType = Option<typeof Component>;
export declare type ComponentOptionTypes = ComponentOptionType[];
