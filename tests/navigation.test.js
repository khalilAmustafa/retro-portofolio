import { describe, it, expect } from 'vitest';
import { CHANNELS, parseHashRoute, formatChannelHash } from '../src/core/navigation.js';
import { projects } from '../src/data/projects.js';

const validIds = new Set(projects.map((p) => p.id));

describe('Portfolio V2 Hash Navigation Parser', () => {
  it('defines all seven canonical channels in exact TV dial order', () => {
    expect(CHANNELS.map((c) => c.slug)).toEqual([
      'home',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'contact'
    ]);
  });

  it('parses empty and top-level channel hashes accurately', () => {
    expect(parseHashRoute('', validIds)).toMatchObject({
      channelIndex: 0,
      channelSlug: 'home',
      subRoute: null,
      canonicalHash: '#home',
      isFallback: false
    });

    expect(parseHashRoute('#education', validIds)).toMatchObject({
      channelIndex: 2,
      channelSlug: 'education',
      subRoute: null,
      canonicalHash: '#education',
      isFallback: false
    });

    expect(parseHashRoute('#certifications', validIds)).toMatchObject({
      channelIndex: 5,
      channelSlug: 'certifications',
      subRoute: null,
      canonicalHash: '#certifications'
    });
  });

  it('resolves deep project case-study hashes while keeping Projects (CH 05) selected', () => {
    const roomsRoute = parseHashRoute('#projects/rooms', validIds);
    expect(roomsRoute).toEqual({
      channelIndex: 4,
      channelSlug: 'projects',
      channelLabel: 'Projects',
      subRoute: 'rooms',
      unknownProjectId: null,
      canonicalHash: '#projects/rooms',
      isFallback: false
    });

    const hbRoute = parseHashRoute('#projects/happensbefore', validIds);
    expect(hbRoute.channelIndex).toBe(4);
    expect(hbRoute.subRoute).toBe('happensbefore');
  });

  it('gracefully falls back to Projects gallery when an unknown project slug is requested', () => {
    const unknownProj = parseHashRoute('#projects/does-not-exist', validIds);
    expect(unknownProj).toEqual({
      channelIndex: 4,
      channelSlug: 'projects',
      channelLabel: 'Projects',
      subRoute: null,
      unknownProjectId: 'does-not-exist',
      canonicalHash: '#projects',
      isFallback: true
    });
  });

  it('gracefully falls back to Home when an unknown top-level hash is requested', () => {
    const unknownChannel = parseHashRoute('#unknown-channel', validIds);
    expect(unknownChannel.channelIndex).toBe(0);
    expect(unknownChannel.channelSlug).toBe('home');
    expect(unknownChannel.isFallback).toBe(true);
  });

  it('wraps rotary channel numbers cleanly across boundaries', () => {
    expect(formatChannelHash(0)).toBe('#home');
    expect(formatChannelHash(4)).toBe('#projects');
    expect(formatChannelHash(-1)).toBe('#contact');
    expect(formatChannelHash(7)).toBe('#home');
  });
});
